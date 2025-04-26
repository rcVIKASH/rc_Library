// utils/wrapAsync.js

const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(next); // pass errors to Express error handler
  };
};

export { wrapAsync };
