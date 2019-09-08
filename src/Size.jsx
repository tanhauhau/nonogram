import React from "react";
import { InputNumber } from "antd";

export default function Size({ size, onChange }) {
  const onChange1 = value => onChange([value, size[1]]);
  const onChange2 = value => onChange([size[0], value]);

  return (
    <div>
      <InputNumber min={1} defaultValue={size[0]} onChange={onChange1} />
      {" X "}
      <InputNumber min={1} defaultValue={size[1]} onChange={onChange2} />
    </div>
  );
}
