const noImg = "//images.igdb.com/igdb/image/upload/t_thumb/nocover.png";

function updateImg(collection) {
  for (let i = 0; i < collection.length; i++) {
    // (typeof collection[i].cover === "undefined")
    if (!collection[i].cover) {
      collection[i].cover = {};
      collection[i].cover.url = noImg;
    }
    // (typeof collection[i].screenshots === "undefined")
    if (!collection[i].screenshots) {
      collection[i].screenshots = [{ url: noImg }];
    }
    // (typeof collection[i].platforms === "undefined")
    if (!collection[i].platforms) {
      collection[i].platforms = [9999];
    }
    if (!collection[i].involved_companies) {
      collection[i].involved_companies = "N/A";
    }
    collection[i].cover.url = resizeImg(collection[i].cover.url, "720p_2x");
  }
}

function addMissing(collection) {
  for (let i = 0; i < collection.length; i++) {
    if (typeof collection[i].cover === "undefined") {
      collection[i].cover = {};
      collection[i].cover.url = noImg;
    }
    if (typeof collection[i].screenshots === "undefined") {
      collection[i].screenshots = [{ url: noImg }];
    }
    if (typeof collection[i].platforms === "undefined") {
      collection[i].platforms = [9999];
    }
    collection[i].cover.url = resizeImg(collection[i].cover.url, "logo_med");
  }
}

function resizeImg(url, size) {
  const origUrl = url;
  const parts = origUrl.split("/");
  parts[6] = `t_${size}`;
  const newUrl = parts.join("/");
  return newUrl;
}

module.exports = {
  updateImg,
  resizeImg,
  addMissing,
  noImg,
};
