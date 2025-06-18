import preguntas from '../data/Preguntas.json';
import etiquetas from '../data/PreguntasContenido.json';

export const loadQuestionsWithLabels = () => {
  try {
    const groupedData = preguntas.map((group) => {
      const relatedLabels = etiquetas.filter(
        (label) => label.group_id === group.group_id
      );

      return {
        ...group,
        labels: relatedLabels,
      };
    });

    return groupedData;
  } catch (error) {
    console.error("Error al cargar preguntas o etiquetas:", error);
    return [];
  }
};
