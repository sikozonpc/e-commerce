import mongoose from 'mongoose';

interface DummyModelAttributes {
  
}

export interface DummyModelDocument extends mongoose.Document, DummyModelAttributes { }

interface DummyModelModel extends mongoose.Model<DummyModelDocument> {
  build: (attrs: DummyModelAttributes) => DummyModelDocument;
}

const dummySchema = new mongoose.Schema({
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});

dummySchema.statics.build = (attrs: DummyModelAttributes) => new DummyModel(attrs);

const DummyModel = mongoose.model<DummyModelDocument, DummyModelModel>(
  'DummyModel',
  dummySchema
);

export { DummyModel };

