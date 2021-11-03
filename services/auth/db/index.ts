import mongo from './mongo';

export const connect = (conURL: string) => {
  return mongo.connect(conURL);
}