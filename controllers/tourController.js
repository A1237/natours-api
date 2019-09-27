const Tour = require('../models/tourModel');

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       message: 'Body not not found'
//     });
//   }
//   next();
// };

exports.getallTours = async (req, res) => {
  try {
    console.log(req)
    console.log(req.query);

    // const fields = req.query.fields.split(',').join(' ');
    // console.log(fields);
    // * Here on logging page it gives 2

    // 1A) Simple Filtering
    const queryObj = {
      ...req.query
    };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced Filtering
    // console.log(queryObj);
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, match => `$${match}`);

    // * method 1
    let query = Tour.find(JSON.parse(queryStr));

    // 2) SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt');
    }

    // * field limiting 
    if (req.query.fields) {
      const sortBy = req.query.fields.split(',').join(' ');
      console.log(sortBy)
      query = query.select(sortBy);
    }


    console.log(req.query, 'asmk');
    //* 3) not completed FIELD LIMITING
    // if (req.query.fields) {
    //   query = query.select(fields);
    // }
    //* not completed FIELD LIMITING

    // EXECUTE QUERY
    const tours = await query;

    // * method 2
    // const query = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')

    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {
        tours: tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    // const tour=Tour.findOne({_id:req.params.id})
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'Success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour=new Tour({})
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    console.log(tour);
    res.status(200).json({
      status: 'Success',
      tour
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: error
    });
  }
};