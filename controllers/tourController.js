const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures')
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       message: 'Body not not found'
//     });
//   }
//   next();
// };



exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage'
  req.query.limit = '5';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next();
}

exports.getallTours = async (req, res) => {
  try {
    console.log(req.query);

    // 1A) Simple Filtering
    // const queryObj = {
    //   ...req.query
    // };
    // const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // excludeFields.forEach(el => delete queryObj[el]);

    // // 1B) Advanced Filtering
    // // console.log(queryObj);
    // let queryStr = JSON.stringify(queryObj);

    // queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, match => `$${match}`);

    // // * method 1
    // let query = Tour.find(JSON.parse(queryStr));

    // // 2) SORTING
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // // * field limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   console.log(fields);
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // 4) PAGINATION

    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit)

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page Does not exist');
    // }

    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    const tours = await features.query;

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

exports.getTourStats = async (req, res) => {
  try {
    const stats = Tour.aggregate([

    ]);
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: error
    });
  }
}