import Button from '@mui/material/Button';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import { getGuides, selectGuides } from '../store/guidesSlice';
import { selectGuideCategorieseBySlug } from '../store/guideCategoriesSlice';

function GuideCategory() {
  const dispatch = useDispatch();
  const routeParams = useParams();
  const guides = useSelector(selectGuides);
  const category = useSelector(selectGuideCategorieseBySlug(routeParams.categorySlug));

  useEffect(() => {
    dispatch(getGuides(routeParams.categorySlug));
  }, [dispatch, routeParams.categorySlug]);

  return (
    <div className="flex flex-col items-center p-24 sm:p-40 container">
      <div className="flex flex-col w-full max-w-4xl">
        <div className="sm:mt-32">
          <Button
            component={Link}
            to={-1}
            color="secondary"
            startIcon={<FuseSvgIcon>heroicons-outline:arrow-narrow-left</FuseSvgIcon>}
          >
            Back to Guides & Resources
          </Button>
        </div>
        <div className="mt-8 text-4xl sm:text-7xl font-extrabold tracking-tight leading-tight">
          {category?.title}
        </div>
        <div className="mt-32 sm:mt-48">
          {guides.map((guide) => (
            <Typography
              component={Link}
              className="flex mt-12 font-medium no-underline hover:underline"
              key={guide.id}
              to={guide.slug}
              color="secondary"
              role="button"
            >
              {guide.title}
            </Typography>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GuideCategory;