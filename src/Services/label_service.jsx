import labels from '../data/labels.json';

export const LabelService = {
  //Obtiene todos los labels
  loadLabelsFromJson: () => {
    return labels;
  }
};
