import { ref, reactive, toRaw } from "vue";
import { ZodError, ZodObject } from "zod";
import type { ZodRawShape } from "zod";

export function useForm<T extends Record<string, any>>(
  initialSchema: ZodObject<ZodRawShape>,
  initialValues?: Partial<T>
) {
  const schema = ref(initialSchema);

  const getDefaultValues = (): T => {
    const defaults: any = {};
    
    try {
      const rawSchema = toRaw(schema.value);
      const shape = rawSchema.shape;
      
      const extractDefault = (field: any): any => {
        if (!field || typeof field !== 'object') return undefined;
        
        try {
          const fieldRaw = toRaw(field);
          const def = (fieldRaw as any)?._def;
          if (!def) return undefined;
          
          if ('defaultValue' in def) {
            const defaultValueGetter = def.defaultValue;
            if (typeof defaultValueGetter === 'function') {
              try {
                return defaultValueGetter();
              } catch {
                return undefined;
              }
            }
            return defaultValueGetter;
          }
          
          if ('typeName' in def && def.typeName === 'ZodObject' && def.shape) {
            const nested: any = {};
            for (const key in def.shape) {
              nested[key] = extractDefault(def.shape[key]);
            }
            return nested;
          }
        } catch (error) {
          return undefined;
        }
        
        return undefined;
      };
      
      for (const key in shape) {
        const defaultValue = extractDefault(shape[key]);
        if (defaultValue !== undefined) {
          defaults[key] = defaultValue;
        }
      }
    } catch (error) {
    }
    
    const merged: any = { ...defaults, ...(initialValues || {}) };
    
    for (const key in merged) {
      if (defaults[key] && typeof defaults[key] === 'object' && !Array.isArray(defaults[key]) && merged[key] && typeof merged[key] === 'object') {
        merged[key] = { ...defaults[key], ...merged[key] };
      }
    }
    
    return merged as T;
  };

  const formData = reactive(getDefaultValues()) as T;
  const errors = ref<Record<keyof T, string | null>>(
    {} as Record<keyof T, string | null>
  );

  const resetErrors = () => {
    for (const key in errors.value) {
      errors.value[key as keyof T] = null;
    }
  };

  const FIELD_LABELS: Record<string, string> = {
    title: 'título',
    description: 'descripción',
    name: 'nombre',
    term: 'término',
    question: 'pregunta',
    language: 'idioma',
    definition: 'definición',
    targetLevel: 'nivel',
    audience: 'audiencia',
    contentLength: 'longitud del contenido',
    tone: 'tono',
  };

  function toFriendlyMessage(message: string, fieldPath: unknown[], code?: string): string {
    const isRequiredError =
      code === 'invalid_type' ||
      /expected .+ received undefined/i.test(message) ||
      /required/i.test(message);
    if (isRequiredError) {
      const key = fieldPath.length > 0 ? String(fieldPath[fieldPath.length - 1]) : '';
      const label = FIELD_LABELS[key] ?? key;
      return label ? `Campo ${label} es requerido` : 'Este campo es requerido';
    }
    return message;
  }

  const updateErrorsFromZod = (error: ZodError<T>) => {
    resetErrors();
    for (const err of error.issues) {
      const field = err.path[0] as keyof T;
      const code = (err as { code?: string }).code;
      errors.value[field] = toFriendlyMessage(err.message, err.path, code);
    }
  };

  const validate = (): boolean => {
    try {
      const dataToValidate = { ...toRaw(formData) } as T;
      schema.value.parse(dataToValidate);
      resetErrors();
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        updateErrorsFromZod(error as ZodError<T>);
      }
      return false;
    }
  };

  const validateField = (field: keyof T): void => {
    try {
      const dataToValidate = { ...toRaw(formData) } as T;
      schema.value.parse(dataToValidate);
      errors.value[field] = null;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldError = error.issues.find((err) => err.path[0] === field);
        const msg = fieldError?.message ?? null;
        const code = fieldError ? (fieldError as { code?: string }).code : undefined;
        errors.value[field] = msg ? toFriendlyMessage(msg, fieldError!.path, code) : null;
      }
    }
  };

  const resetForm = (values?: Partial<T>) => {
    Object.assign(formData, values || initialValues || {});
    resetErrors();
  };

  const handleSubmit = async (callback: (data: any) => Promise<void> | void) => {
    if (validate()) {
      const dataToSubmit = { ...toRaw(formData) } as T;
      await callback(dataToSubmit);
    }
  };

  const setSchema = (newSchema: ZodObject<ZodRawShape>) => {
    schema.value = newSchema;
    validate();
  };

  return {
    formData,
    errors,
    handleSubmit,
    validateField,
    resetForm,
    setSchema,
  };
}