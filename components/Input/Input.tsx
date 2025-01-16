import { InputProps } from './Input.props';
import styles from './Input.module.css';
import cn from 'classnames';
import { forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, error, ...props }, ref) => {
		return (
			<div className={cn(styles.inputWrapper, className)}>
				<input
					ref={ref}
					className={cn(styles.input, {
						[styles.error]: error
					})}
					{...props}
				/>
				{error && (
					<span className={styles.errorMessage}>{error.message}</span>
				)}
			</div>
		);
	}
);

Input.displayName = 'Input'; // Устанавливаем display name для компонента

export { Input };
