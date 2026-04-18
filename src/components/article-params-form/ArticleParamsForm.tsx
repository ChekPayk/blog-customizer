import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';

import styles from './ArticleParamsForm.module.scss';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
	OptionType,
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
} from 'src/constants/articleProps';

interface ArticleParamsFormProps {
	currentState: typeof defaultArticleState;
	onStateChange: (params: typeof defaultArticleState) => void;
}

export const ArticleParamsForm = ({
	currentState,
	onStateChange,
}: ArticleParamsFormProps) => {
	const [isFormOpen, setIsFormOpen] = useState(false);

	const [tempParams, setTempParams] = useState(defaultArticleState);

	useEffect(() => {
		setTempParams(currentState);
	}, [currentState]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onStateChange(tempParams);
	};

	const handleReset = () => {
		setTempParams(defaultArticleState);
		onStateChange(defaultArticleState);
	};

	const updateFormField = (field: keyof typeof defaultArticleState) => {
		return (option: OptionType) => {
			setTempParams({ ...tempParams, [field]: option });
		};
	};

	useEffect(() => {
		if (!isFormOpen) {
			return;
		}

		const handleClick = (event: MouseEvent) => {
			const target = event.target as HTMLElement;

			const formContainer = target.closest(`.${styles.container}`);
			const arrowButton = target.closest('[data-arrow-button]');

			if (!formContainer && !arrowButton) {
				setIsFormOpen(false);
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsFormOpen(false);
			}
		};

		window.addEventListener('mousedown', handleClick);
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('mousedown', handleClick);
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isFormOpen]);

	return (
		<>
			<ArrowButton
				data-arrow-button
				isOpen={isFormOpen}
				onClick={() => {
					setIsFormOpen(!isFormOpen);
				}}
			/>
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isFormOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as='h2' size={31} weight={800} uppercase dynamicLite>
						Задайте параметры
					</Text>

					<Select
						selected={tempParams.fontFamilyOption}
						onChange={updateFormField('fontFamilyOption')}
						options={fontFamilyOptions}
						title='шрифт'
					/>

					<RadioGroup
						selected={tempParams.fontSizeOption}
						name='fontSize'
						onChange={updateFormField('fontSizeOption')}
						options={fontSizeOptions}
						title='размер шрифта'
					/>

					<Select
						selected={tempParams.fontColor}
						onChange={updateFormField('fontColor')}
						options={fontColors}
						title='цвет шрифта'
					/>

					<Separator />

					<Select
						selected={tempParams.backgroundColor}
						onChange={updateFormField('backgroundColor')}
						options={backgroundColors}
						title='цвет фона'
					/>

					<Select
						selected={tempParams.contentWidth}
						onChange={updateFormField('contentWidth')}
						options={contentWidthArr}
						title='ширина контента'
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
