import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const steps = [
  { id: 'Datos del vehículo', fields: ['plate', 'vehicleType', 'brand'] },
  { id: 'Detalles de la reserva', fields: ['startDate', 'endDate', 'parkingSpace'] },
  { id: 'Confirmación', fields: [] },
];

const vehicleTypes = [
  { id: 'car', name: 'Automóvil' },
  { id: 'motorcycle', name: 'Motocicleta' },
  { id: 'truck', name: 'Camión' },
  { id: 'van', name: 'Van' },
];

const parkingSpaces = [
  { id: 'A1', type: 'standard', status: 'available' },
  { id: 'A2', type: 'premium', status: 'available' },
  { id: 'A3', type: 'vip', status: 'reserved' },
  { id: 'B1', type: 'standard', status: 'available' },
];

const ReservationForm = ({ onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      plate: '',
      vehicleType: '',
      brand: '',
      startDate: null,
      endDate: null,
      parkingSpace: '',
    },
  });

  const watchFields = watch();

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields);
    
    if (output) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSpaceSelect = (spaceId) => {
    setSelectedSpace(spaceId);
    setValue('parkingSpace', spaceId);
  };

  const onFormSubmit = async (data) => {
    if (currentStep < steps.length - 1) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        parkingSpace: selectedSpace,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placa del vehículo *
              </label>
              <input
                type="text"
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.plate ? 'border-red-500' : ''
                }`}
                placeholder="ABC-1234"
                {...register('plate', { required: 'La placa es requerida' })}
              />
              {errors.plate && (
                <p className="mt-1 text-sm text-red-600">{errors.plate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de vehículo *
              </label>
              <select
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.vehicleType ? 'border-red-500' : ''
                }`}
                {...register('vehicleType', { required: 'Seleccione un tipo de vehículo' })}
              >
                <option value="">Seleccione...</option>
                {vehicleTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.vehicleType && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca del vehículo
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Ej: Toyota, Honda, etc."
                {...register('brand')}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha y hora de inicio *
                </label>
                <DatePicker
                  selected={watchFields.startDate}
                  onChange={(date) => setValue('startDate', date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy HH:mm"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholderText="Seleccione fecha y hora"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha y hora de fin *
                </label>
                <DatePicker
                  selected={watchFields.endDate}
                  onChange={(date) => setValue('endDate', date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  minDate={watchFields.startDate || new Date()}
                  dateFormat="dd/MM/yyyy HH:mm"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholderText="Seleccione fecha y hora"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccione un espacio de estacionamiento *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {parkingSpaces.map((space) => (
                  <button
                    key={space.id}
                    type="button"
                    onClick={() => handleSpaceSelect(space.id)}
                    disabled={space.status === 'reserved'}
                    className={`p-3 border-2 rounded-lg text-center transition-colors ${
                      selectedSpace === space.id
                        ? 'border-blue-500 bg-blue-50'
                        : space.status === 'reserved'
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="font-medium">{space.id}</div>
                    <div className="text-xs text-gray-500 capitalize">{space.type}</div>
                  </button>
                ))}
              </div>
              {!selectedSpace && watchFields.parkingSpace === '' && (
                <p className="mt-1 text-sm text-red-600">Seleccione un espacio de estacionamiento</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Confirmar reserva</h3>
            <div className="mt-4 bg-gray-50 p-4 rounded-lg text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Vehículo</h4>
                  <p className="text-gray-600">Placa: {watchFields.plate}</p>
                  <p className="text-gray-600">Tipo: {vehicleTypes.find(vt => vt.id === watchFields.vehicleType)?.name}</p>
                  {watchFields.brand && <p className="text-gray-600">Marca: {watchFields.brand}</p>}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Reserva</h4>
                  <p className="text-gray-600">Espacio: {selectedSpace}</p>
                  <p className="text-gray-600">
                    Inicio: {watchFields.startDate?.toLocaleString() || 'No seleccionado'}
                  </p>
                  <p className="text-gray-600">
                    Fin: {watchFields.endDate?.toLocaleString() || 'No seleccionado'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                {steps[currentStep].id}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center">
                {steps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(index)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        currentStep >= index
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </button>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          currentStep > index ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="px-6 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
              <button
                type="button"
                onClick={currentStep === 0 ? onClose : prevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {currentStep === 0 ? 'Cancelar' : 'Atrás'}
              </button>
              
              <div className="flex space-x-3">
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Siguiente
                    <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Procesando...' : 'Confirmar reserva'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ReservationForm;
