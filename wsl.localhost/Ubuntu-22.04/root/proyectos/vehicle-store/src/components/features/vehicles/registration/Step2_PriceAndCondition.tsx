//wsl.localhost/Ubuntu-22.04/root/proyectos/vehicle-store/src/components/features/vehicles/registration/Step2_PriceAndCondition.tsx

// ... existing code ...
const Step2_PriceAndCondition: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [showFinancingTips, setShowFinancingTips] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const priceValidation = useFieldValidation(formData.price, errors.price);
  const mileageValidation = useFieldValidation(
// ... existing code ...