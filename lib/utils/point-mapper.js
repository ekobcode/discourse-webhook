module.exports = {
  post_created: Number(process.env.POINT_POST) || 30,
  post_liked: Number(process.env.POINT_LIKE) || 10,
  topic_created: Number(process.env.POINT_COMMAND) || 50
};
