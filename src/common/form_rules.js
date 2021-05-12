export function requiredRule(message) {
  return { required: true, message: message, trigger: "blur" }
}

export function lengthRule(min, max) {
  if(max) return { min: min, max: max, message: `长度在 ${min} 到 ${max} 个字符`, trigger: "blur"}
  else return { min: min, message: `长度不能小于 ${min} 个字符`, trigger: "blur"}
}