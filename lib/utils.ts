import fs from 'fs/promises';
import { Jimp } from 'jimp';
import { parseISO, format } from 'date-fns';

const retry = (promise: (...args: unknown[]) => Promise<unknown>, args: unknown, maxRetries = 3, interval = 500) =>
  new Promise((resolve, reject) => {
    return promise(args)
      .then(resolve)
      .catch(() => {
        setTimeout(() => {
          console.log('Retrying failed promise...', maxRetries);
          if (0 === maxRetries) {
            return reject('Maximum retries exceeded');
          }
          retry(promise, args, maxRetries - 1, interval).then(resolve, reject);
        }, interval);
      });
  });

const waitUntilFileExists = (filePath: string, timeout: number) => {
  return retry(fs.readFile, filePath, Math.round(timeout / 1000)) as Promise<string>;
};

const resizeImage = async (
  filePath: string,
  quality: number,
  reductionRatio: number
) => {
  try {
    const file = await Jimp.read(filePath);
    return await file
      .resize({
        w: Math.round(file.width / reductionRatio),
        h: Math.round(file.height / reductionRatio)
      })
      .write(`${filePath.split('.').splice(-1).concat('.')}.jpeg`, { quality });
  } catch (err) {
    throw err;
  }
};

export const waitForFileExistsAndResize = async (
  filePath: string,
  quality: number,
  reductionRatio: number
) => {
  const file = await waitUntilFileExists(filePath, 1500);
  return await resizeImage(file, quality, reductionRatio);
};

export const deepSearch = (searchTerm: string, obj: any, found = []) => {
  Object.keys(obj).forEach(key => {
    if (key === searchTerm) {
      found.push(obj[key]);
      return found;
    }
    if (typeof obj[key] === 'object') {
      deepSearch(searchTerm, obj[key], found);
    }
  });
  return found;
};

export const formatDateString = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMMM d, yyyy HH:mm:ss');
  } catch (ex) {
    return dateString;
  }
};
