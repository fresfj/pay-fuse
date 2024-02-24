import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils'
import maintenancePageConfig from './maintenance/maintenancePageConfig'
import activitiesPageConfig from './activities/activitiesPageConfig'
import authenticationPagesConfig from './authentication/authenticationPagesConfig'
import comingSoonPagesConfig from './coming-soon/comingSoonPagesConfig'
import invoicePagesConfig from './invoice/invoicePagesConfig'
import errorPagesConfig from './error/errorPagesConfig'
import pricingPagesConfig from './pricing/pricingPagesConfig'
import searchPagesConfig from './search/searchPagesConfig'
import checkoutPagesConfig from './checkout/CheckoutAppConfig'
/**
 * The pages routes config.
 */
const pagesConfigs: FuseRouteConfigsType = [
  ...authenticationPagesConfig,
  checkoutPagesConfig,
  comingSoonPagesConfig,
  errorPagesConfig,
  maintenancePageConfig,
  invoicePagesConfig,
  activitiesPageConfig,
  pricingPagesConfig,
  searchPagesConfig
]

export default pagesConfigs
