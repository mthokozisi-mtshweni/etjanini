// export function optimizeCloudinaryImage(
//   imageUrl,
//   options = {}
// ) {
//   if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) {
//     return imageUrl;
//   }

//   const {
//     width = 1200,
//     height,
//     crop = "limit",
//   } = options;

//   const transformations = [
//     `c_${crop}`,
//     `w_${width}`,
//   ];

//   if (height) {
//     transformations.push(`h_${height}`);
//   }

//   transformations.push("f_auto", "q_auto");

//   return imageUrl.replace(
//     "/image/upload/",
//     `/image/upload/${transformations.join("/")}/`
//   );
// }


export function optimizeCloudinaryImage(
  imageUrl,
  {
    width = 1200,
    height,
    crop = "limit",
  } = {}
) {
  if (
    !imageUrl ||
    !imageUrl.includes("res.cloudinary.com")
  ) {
    return imageUrl;
  }

  const transformations = [
    `c_${crop}`,
    `w_${width}`,
  ];

  if (height) {
    transformations.push(`h_${height}`);
  }

  transformations.push("f_auto", "q_auto");

  return imageUrl.replace(
    "/image/upload/",
    `/image/upload/${transformations.join("/")}/`
  );
}


export function getCloudinarySrcSet(
  imageUrl,
  {
    height,
    crop = "limit",
    widths = [480, 768, 1024, 1440],
  } = {}
) {
  if (
    !imageUrl ||
    !imageUrl.includes("res.cloudinary.com")
  ) {
    return undefined;
  }

  return widths
    .map((width) => {
      const transformations = [
        `c_${crop}`,
        `w_${width}`,
      ];

      if (height) {
        transformations.push(`h_${height}`);
      }

      transformations.push("f_auto", "q_auto");

      const url = imageUrl.replace(
        "/image/upload/",
        `/image/upload/${transformations.join("/")}/`
      );

      return `${url} ${width}w`;
    })
    .join(", ");
}