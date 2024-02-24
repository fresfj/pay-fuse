import { createSelector } from '@reduxjs/toolkit'
import apiService from 'app/store/apiService'
import _ from '@lodash'
import { RootStateType } from 'app/store/types'

export const addTagTypes = [
  'eCommerce_product',
  'eCommerce_products',
  'checkout_guides',
  'checkout_guides_by_category',
  'checkout_guide',
  'checkout_guide_categories',
  'checkout_faqs',
  'checkout_faqs_by_category',
  'checkout_most_asked_faqs',
  'checkout_faq_categories'
] as const

const CheckoutApi = apiService
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: build => ({
      getECommerceProduct: build.query<
        GetECommerceProductApiResponse,
        GetECommerceProductApiArg
      >({
        query: productId => ({
          url: `/mock-api/ecommerce/products/${productId}`
        }),
        providesTags: ['eCommerce_product', 'eCommerce_products']
      }),
      getCheckoutGuides: build.query<
        GetCheckoutGuidesApiResponse,
        GetCheckoutGuidesApiArg
      >({
        query: () => ({ url: `/mock-api/help-center/guides` }),
        providesTags: ['checkout_guides']
      }),
      getCheckoutGuidesByCategory: build.query<
        GetCheckoutGuidesByCategoryApiResponse,
        GetCheckoutGuidesByCategoryApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/help-center/guides/${queryArg.categorySlug}`
        }),
        providesTags: ['checkout_guides_by_category']
      }),
      getCheckoutGuideByCategory: build.query<
        GetCheckoutGuideByCategoryApiResponse,
        GetCheckoutGuideByCategoryApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/help-center/guides/${queryArg.categorySlug}/${queryArg.guideSlug}`
        }),
        providesTags: ['checkout_guide']
      }),
      getCheckoutGuideCategories: build.query<
        GetCheckoutGuideCategoriesApiResponse,
        GetCheckoutGuideCategoriesApiArg
      >({
        query: () => ({ url: `/mock-api/help-center/guides/categories` }),
        providesTags: ['checkout_guide_categories']
      }),
      getCheckoutFaqs: build.query<
        GetCheckoutFaqsApiResponse,
        GetCheckoutFaqsApiArg
      >({
        query: () => ({ url: `/mock-api/help-center/faqs` }),
        providesTags: ['checkout_faqs']
      }),
      getCheckoutFaqsByCategory: build.query<
        GetCheckoutFaqsByCategoryApiResponse,
        GetCheckoutFaqsByCategoryApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/help-center/faqs/${queryArg.categorySlug}`
        }),
        providesTags: ['checkout_faqs_by_category']
      }),
      getCheckoutMostlyFaqs: build.query<
        GetMostlyFaqsApiResponse,
        GetMostlyFaqsApiArg
      >({
        query: () => ({ url: `/mock-api/help-center/faqs/most-asked` }),
        providesTags: ['checkout_most_asked_faqs']
      }),
      getCheckoutFaqCategories: build.query<
        GetCheckoutFaqCategoriesApiResponse,
        GetCheckoutFaqCategoriesApiArg
      >({
        query: () => ({ url: `/mock-api/help-center/faqs/categories` }),
        providesTags: ['checkout_faq_categories']
      })
    }),
    overrideExisting: false
  })
export default CheckoutApi

export type GetECommerceProductApiResponse = EcommerceProduct
export type GetECommerceProductApiArg = string

export type GetCheckoutGuidesApiResponse = /** status 200 OK */ Guide[]
export type GetCheckoutGuidesApiArg = void

export type GetCheckoutGuidesByCategoryApiResponse =
  /** status 200 OK */ Guide[]
export type GetCheckoutGuidesByCategoryApiArg = {
  /** category slug */
  categorySlug: string
}

export type GetCheckoutGuideByCategoryApiResponse = /** status 200 OK */ Guide
export type GetCheckoutGuideByCategoryApiArg = {
  /** category slug */
  categorySlug: string
  /** guide slug */
  guideSlug: string
}

export type GetCheckoutGuideCategoriesApiResponse =
  /** status 200 OK */ GuideCategory[]
export type GetCheckoutGuideCategoriesApiArg = void

export type GetCheckoutFaqsApiResponse = /** status 200 OK */ Faq[]
export type GetCheckoutFaqsApiArg = void

export type GetCheckoutFaqsByCategoryApiResponse = /** status 200 OK */ Faq[]
export type GetCheckoutFaqsByCategoryApiArg = {
  /** category slug */
  categorySlug: string
}

export type GetMostlyFaqsApiResponse = /** status 200 OK */ Faq[]
export type GetMostlyFaqsApiArg = void

export type GetCheckoutFaqCategoriesApiResponse =
  /** status 200 OK */ FaqCategory[]
export type GetCheckoutFaqCategoriesApiArg = void

export type Guide = {
  id: string
  categoryId: string
  slug: string
  title: string
  subtitle: string
  content: string
}

export type GuideCategory = {
  id: string
  slug: string
  title: string
}

export type Faq = {
  id: string
  categoryId: string
  question: string
  answer: string
}

export type FaqCategory = {
  id: string
  slug: string
  title: string
}

export type EcommerceProductImageType = {
  id: string
  url: string
  type: string
}

export type EcommerceProduct = {
  id: string
  name: string
  handle: string
  description: string
  categories: string[]
  tags: string[]
  featuredImageId: string
  images: EcommerceProductImageType[]
  priceTaxExcl: number
  priceTaxIncl: number
  taxRate: number
  comparedPrice: number
  quantity: number
  sku: string
  width: string
  height: string
  depth: string
  weight: string
  extraShippingFee: number
  active: boolean
}

export const {
  useGetECommerceProductQuery,
  useGetCheckoutGuidesQuery,
  useGetCheckoutGuidesByCategoryQuery,
  useGetCheckoutGuideByCategoryQuery,
  useGetCheckoutGuideCategoriesQuery,
  useGetCheckoutFaqsQuery,
  useGetCheckoutFaqsByCategoryQuery,
  useGetCheckoutMostlyFaqsQuery,
  useGetCheckoutFaqCategoriesQuery
} = CheckoutApi

export const selectGroupedGuides = createSelector(
  [
    (state: RootStateType) =>
      CheckoutApi.endpoints.getCheckoutGuides.select()(state)?.data || [],
    (state: RootStateType) =>
      CheckoutApi.endpoints.getCheckoutGuideCategories.select()(state)?.data ||
      []
  ],
  (guides, categories) => {
    return categories.map(category => ({
      ...category,
      guides: _.filter(guides, { categoryId: category.id })
    }))
  }
)

export const selectGuideCategoryBySlug = (slug: GuideCategory['slug']) =>
  createSelector(
    [
      (state: RootStateType) =>
        CheckoutApi.endpoints.getCheckoutGuideCategories.select()(state)
          ?.data || []
    ],
    categories => {
      return _.find(categories, { slug })
    }
  )
