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
    console.log(rows, "rows");
    for (var a = 0; a < rows; a++) {
      let getdata = await seatModel.find({
        id: { $gte: 7 * a + 1, $lte: 7 * a + 7 },
        isBooked: false,
      });
      console.log(getdata, "getdata");
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

function seatIdsArray(seats) {
  let ids = [];
  for (var i = seats[0]; i <= seats[1]; i++) {
    console.log(arr[i], i);
    ids.push(arr[i]);
  }
  return ids;
}

module.exports = {
  seatIdsArray,
  closestseats,
  checkInSameRow,
  updateArrayOfIds,
  checkInAnyRow,
};
