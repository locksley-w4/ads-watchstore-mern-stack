let requests = 0;
export function logger(req, res, next) {
  console.log("Upcoming request #", requests++);
  next();
}
