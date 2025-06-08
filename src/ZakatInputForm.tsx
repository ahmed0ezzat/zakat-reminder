import React from 'react';
import ZakatInputStepper from './components/forms/ZakatInputStepper';
import type { ZakatType } from './types';

interface Props {
  lang: string;
  zakatTypes: ZakatType[];
  errors: string | null;
  setErrors: (err: string | null) => void;
  goldPrice?: number;
  fitrValue?: number;
  silverPrice?: number;
}

const ZakatInputForm: React.FC<Props> = (props) => {
  return <ZakatInputStepper {...props} />;
};

export default ZakatInputForm;
