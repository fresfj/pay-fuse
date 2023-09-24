import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch } from 'app/store/index';
import { getCategories } from './store/categoriesSlice';

function AcademyApp() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getCategories());
	}, [dispatch]);

	return <Outlet />;
}

export default AcademyApp;
