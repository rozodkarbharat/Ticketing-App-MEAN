const express = require("express");
const { connection } = require("./db");
const { seatModel } = require("./model/seat.model");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to the app!");
});

// app.post('/add',async(req,res) => {

//     try {
//         let objectsToCreate=[]
//         for (let a=0;a<80;a++) {
//             if(a>10&&a<30){
//                 objectsToCreate.push({id:a+1,isBooked:true})
//             }
//             else{
//                 objectsToCreate.push({id:a+1,isBooked:false})
//             }
//           }
//         for (let i = 0; i < objectsToCreate.length; i++) {
//             const object = new seatModel(objectsToCreate[i]);
//             await object.save();
//           }

//         res.status(200).json({ message: 'Objects created successfully' });
//       } catch (error) {
//         console.log(error.message)
//         res.status(500).json({ error: 'Failed to create objects' });
//       }
// })

app.get("/getseats", async (req, res) => {
  const data = await seatModel.find();
  res.send(data);
});

app.patch("/reset", async (req, res) => {
  try {
    const data = await seatModel.updateMany(
      { isBooked: true },
      { isBooked: false }
    );
    const result = await seatModel.find();
    console.log(result);
    res.status(200).json({ message: "Documents updated successfully", result });
  } catch (error) {
    res.status(500).json({ error: "Failed to update documents" });
  }
});

app.patch("/edit", async (req, res) => {
  let arr = [1, 2, 5, 15, 16, 17, 18, 19, 20, 21, 22];
  const data = await seatModel.updateMany(
    { id: { $in: arr } },
    { isBooked: true }
  );
  res.send("done updating");
});

app.post("/book", async (req, res) => {
  try {
    let n = req.body.numberOfSeats;
    let ids = [];
    ids = await checkInSameRow(n);
    console.log(ids, "checkInSameRow");
    if (ids.length > 0) {
      let resulData = await updateArrayOfIds(ids);
      res.send({
        result: resulData,
        message: "Booked successfully",
        res: true,
        recentlyBookedseats:ids
      });
    } 
    else {
      ids = await checkInAnyRow(n);
    //   console.log(ids,'checkInAnyRow')
      if (ids.length > 0) {
        let resulData = await updateArrayOfIds(ids);
        console.log(resulData,'checkInAnyRow')
        res.send({
          result: resulData,
          message: "Booked successfully",
          res: true,
          recentlyBookedseats:ids
        });
      } 
      else {
        res.status(200).send({ message: "No Seat is Available", res: false });
      }
    }
  } catch (e) {
    res.status(500).send({ message: "Error updating", res: false });
  }
});

async function updateArrayOfIds(ids) {
  const result = await seatModel.updateMany(
    { id: { $in: ids } },
    { isBooked: true }
  );

  return await seatModel.find();
}

async function checkInAnyRow(n) {
  let data = await seatModel.find({ isBooked: false });
  if (data.length > 0) {
    let arr = [];
    let ids = [];
    for (var a = 0; a < data.length; a++) {
      arr.push(data[a].id);
    }

    let seats = closestseats(arr, n);

    for (var i = seats[0]; i <= seats[1]; i++) {
      ids.push(arr[i]);
    }
    return ids;
  } else {
    return [];
  }
}

async function checkInSameRow(n) {
  try {
    let rows = Math.ceil(80 / 7);

    let start = 0;
    let end = 0;
    let diff = Infinity;
    let ansArr = [];
    for (var a = 0; a < rows; a++) {
      let getdata = await seatModel.find({
        id: { $gte: 7 * a + 1, $lte: 7 * a + 7 },isBooked: false
      });
      let Ids = [];
      if (getdata.length >= n) {
        for (let i = 0; i < getdata.length; i++) {
          Ids.push(getdata[i].id);
        }

        let seats = closestseats(Ids, n);
        seatsLength = Math.abs(seats[0] - seats[1]);
        if (seatsLength == n) {
          start = Ids[seats[0]];
          end = Ids[seats[1]];
          diff = n;
          ansArr = Ids;
          break;
        }
        if (diff > seatsLength) {
          start = Ids[seats[0]];
          end = Ids[seats[1]];
          diff = seatsLength;
          ansArr = Ids;
        }
      }
    }
    if (start == 0 && end == 0) {
      return [];
    } else {
      let ids = [];
      for (let i = 0; i < ansArr.length; i++) {
        if (ansArr[i] >= start && ansArr[i] <= end) {
          ids.push(ansArr[i]);
        }
      }
      return ids;
    }
  } catch (error) {
    res.status(500).send({ message: error.message, res: false });
  }
}

function closestseats(arr, n) {
  let start = 0;
  let end = n - 1;
  let diff = +Infinity;
  let left = 0;
  let right = n - 1;
  while (right < arr.length) {
    if (Math.abs(arr[right] - arr[left]) < diff) {
      start = left;
      end = right;
      diff = Math.abs(arr[right] - arr[left]);
    }
    left++;
    right++;
  }
  return [start, end];
}



app.listen(8000, async () => {
  try {
    await connection;
    console.log("server running successfully");
  } catch (err) {}
});
