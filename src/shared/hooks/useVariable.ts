type ApplyVariable = (text: string, variableName: string, value: string | number) => string;

export const useVariable = (): { apply: ApplyVariable } => {
  const apply: ApplyVariable = (text, variableName, value) => {
    const regex = new RegExp(`{{${variableName}}}`, 'g');
    return text.replace(regex, String(value));
  };

  return { apply };
};
