import User from "../models/User.js";
import Video from "../models/Video.js";
import { createError } from "../error.js";

export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.params.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You can update only your video!"));
    }
  } catch (err) {
    next(err);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("The video has been deleted.");
    } else {
      return next(createError(403, "You can delete only your video!"));
    }
  } catch (err) {
    next(err);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("The view has been increased.");
  } catch (err) {
    next(err);
  }
};

export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 2 } }]);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => {
        return await Video.find({ userId: channelId });
      })
    );

    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};

export const getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  const query = req.query.q;
  const type = req.query.t;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
      //typeOfQuestion: typeOfQuestion,
    }).limit(40);

    const samples = await Video.find({
      $and: [
        { title: { $regex: query, $options: "i" } },
        { typeOfQuestion: { $regex: type } },
      ],
    });
    console.log(samples);
    res.status(200).json(samples);
  } catch (err) {
    next(err);
  }
};

export const isSponsorred = async (req, res) => {
  try {
    const video = await Video.find({ isSponsorred: "true" }.exec());
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const getallevents = async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let videos;
    if (username) {
      videos = await Video.find({ username });
    } /*else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    }*/ else {
      videos = await Video.find();
    }
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json(err);
  }
};
//GET POST
export const getVideoById = async (req, res) => {
  try {
    const videos = await Video.findById(req.params.id);
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const newcooment = async (req, res) => {
  try {
    const comment = await Video.findById(req.params.id);
    if (!comment) {
      res.status(403).json("wrong event id");
    } else {
      try {
        const newcomment = await Video.findByIdAndUpdate(
          req.params.id,
          {
            $push: req.body,
          },
          { new: true }
        );
        res.status(200).json(newcomment);
      } catch (err) {
        next();
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//
export const fechusersvideos = async (req, res) => {
  const userId = req.params.id;
  try {
    if (userId) {
      const videos = await Video.find({ userId });
      res.status(200).json(videos);
    } else {
      res.status(400).json("wrong user id");
    }
  } catch (err) {
    next();
  }
};
