import { ReviewFormProps } from './ReviewForm.props';
import styles from './ReviewForm.module.css';
import cn from 'classnames';
import { Input } from '../Input/Input';
import { Rating } from '../Rating/Rating';
import { Textarea } from '../Textarea/Textarea';
import { Button } from '../Button/Button';
import CloseIcon from './close.svg';
import { useForm, Controller } from 'react-hook-form';
import { IReviewFormProps } from './ReviewForm.interface';

export const ReviewForm = ({
	productId,
	className,

	...props
}: ReviewFormProps): JSX.Element => {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<IReviewFormProps>();
	const onSubmit = (data: IReviewFormProps) => {
		console.log(data);
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className={cn(styles.reviewForm, className)} {...props}>
				<Input
					{...register('name', {
						required: { value: true, message: 'Заполните имя' }
					})}
					className={styles.title}
					placeholder="Имя"
					error={errors.name}
				/>
				<Input
					{...register('title', {
						required: {
							value: true,
							message: 'Заполните заголовок'
						}
					})}
					className={styles.title}
					placeholder="Заголовок отзыва"
					error={errors.title}
				/>
				<div className={styles.rating}>
					<span>Оценка</span>
					<Controller
						control={control}
						name="rating"
						rules={{
							required: {
								value: true,
								message: 'Укажите рейтинг'
							}
						}}
						render={({ field }) => (
							<Rating
								isEditable
								rating={field.value}
								ref={field.ref}
								setRating={field.onChange}
								error={errors.rating}
							/>
						)}
					/>
				</div>
				<Textarea
					{...register('description', {
						required: { value: true, message: 'Заполните описание' }
					})}
					className={styles.description}
					placeholder="Текст отзыва"
					error={errors.description}
				/>
				<div className={styles.submit}>
					<Button appearance={'primary'}>Отправить</Button>
					<span className={styles.info}>
						* Перед публикацией отзыв пройдет предварительную
						модерацию и проверку
					</span>
				</div>
			</div>
			<div className={styles.success}>
				<div className={styles.successTitle}> Ваш отзыв отправлен</div>
				<div>Спасибо, ваш отзыв будет виден после проверки.</div>
				<CloseIcon className={styles.close} />
			</div>
		</form>
	);
};
