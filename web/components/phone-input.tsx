import { cn } from "#lib/utils";
import * as React from "react";
import { usePhoneInput, UsePhoneInputConfig } from "react-international-phone";
import "react-international-phone/style.css";
import { Input } from "./ui/input";

const PhoneInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<"input">, "onChange" | "value"> & {
    onChange: UsePhoneInputConfig["onChange"];
    value: UsePhoneInputConfig["value"];
  }
>(({ className, onChange, value, placeholder = "+90 (XXX) XXX XX XX", ...props }, ref = null) => {
  const { inputValue, handlePhoneValueChange, inputRef } = usePhoneInput({
    defaultCountry: "tr",
    value: value,
    onChange,
    inputRef: ref as React.MutableRefObject<HTMLInputElement | null>,
  });

  return (
    <Input
      className={cn(className)}
      value={inputValue}
      placeholder={placeholder}
      onChange={handlePhoneValueChange}
      ref={inputRef}
      {...props}
    />
  );
});

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
