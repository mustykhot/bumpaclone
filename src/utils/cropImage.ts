export const createImage = (url: any) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export function getRadianAngle(degreeValue: any) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: any, height: any, rotation: any) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export default async function getCroppedImg(
  imageSrc: any,
  pixelCrop: any,
  rotation: any = 0,
  fileName: any,
  flip = { horizontal: false, vertical: false }
) {
  const image: any = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");

  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return null;
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // As Base64 string
  // return croppedCanvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((file: any) => {
      file.name = fileName;
      resolve({ file: file, url: URL.createObjectURL(file) });
    }, "image/jpeg");
  });
}

export const resizeFile = (file: any, width: number, height: number) => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    let img = document.createElement("img");
    img.src = url;
    img.style.display = "none";
    img.onload = () => {
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      let ratio = w / h;
      let aspectWidth = ratio * height;
      let aspectHeight = width / ratio;
      let xCenter = aspectWidth / 2;
      let yCenter = aspectHeight / 2;
      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.style.display = "none";
      document.body.appendChild(canvas);
      let ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, height);
        if (aspectWidth > width) {
          ctx.drawImage(img, 0, height / 2 - yCenter, width, aspectHeight);
        } else if (aspectHeight > height) {
          ctx.drawImage(img, width / 2 - xCenter, 0, aspectWidth, height);
        } else {
          ctx.drawImage(img, 0, 0, width, height);
        }
        canvas.toBlob((blob) => {
          const b: any = blob;
          b.lastModified = new Date();
          b.name = file.name;
          const blobToFile: File = b as File;
          resolve(blobToFile);
        });
        document.body.removeChild(img);
        document.body.removeChild(canvas);
      }
    };
    document.body.appendChild(img); // Use document.body
  });
};
