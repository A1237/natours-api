const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       message: 'Body not not found'
//     });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage';
  req.query.limit = '5';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getallTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
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
    const stats = await Tour.aggregate([
      // {
      //   $match: {
      //     $ratingsAverage: {
      //       $gte: 4.5
      //     }
      //   }
      // },
      {
        $group: {
          // _id: null,
          _id: {
            $toUpper: '$difficulty'
          },
          // _id: '$duration',
          numTours: {
            $sum: 1
          },
          numRatings: {
            $sum: '$ratingsQuantity'
          },
          avgRating: {
            $avg: '$ratingsAverage'
          },
          avgPrice: {
            $avg: '$price'
          },
          maxPrice: {
            $max: '$price'
          },
          minPrice: {
            $min: '$price'
          }
        }
      },
      {
        $sort: {
          avgPrice: 1
        }
      },
      // {
      //   $match: {
      //     _id: {
      //       $ne: 'EASY'
      //     }
      //   }
      // }
    ]);

    res.status(200).json({
      status: 'Success',
      data: {
        stats
      }

    });
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: error
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([{
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`)
            // $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            $month: '$startDates'
          },
          numTourStarts: {
            $sum: 1
          },
          tours: {
            $push: '$name'
          }
        }
      }

    ])


    res.status(200).json({
      status: 'Success',
      data: {
        plan
      }

    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err
    });
  }
}