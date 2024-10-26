import { IDType } from 'mobx-restful';

export default {
  captcha: 'Captcha',
  mobile_phone_number: 'Mobile Phone number',
  SMS_code: 'SMS code',
  confirm: 'Confirm',
  sign_in: 'Sign in',
  sign_in_successfully: 'Sign in successfully!',
  sign_out: 'Sign out',

  welcome_to: 'Welcome to',
  get_started_by_editing: 'Get started by editing',
  upstream_projects: 'Upstream projects',
  home_page: 'Home Page',
  source_code: 'Source Code',
  component: 'Component',
  pagination: 'Pagination',
  powered_by: 'Powered by',
  documentation: 'Documentation',
  documentation_summary:
    'Find in-depth information about Next.js features and API.',
  learn: 'Learn',
  learn_summary: 'Learn about Next.js in an interactive course with quizzes!',
  examples: 'Examples',
  examples_summary: 'Discover and deploy boilerplate example Next.js projects.',
  deploy: 'Deploy',
  deploy_summary:
    'Instantly deploy your Next.js site to a public URL with Vercel.',
  create: 'Create',
  submit: 'Submit',
  cancel: 'Cancel',
  edit: 'Edit',
  delete: 'Delete',
  total_x_rows: ({ totalCount }: { totalCount: number }) =>
    `Total ${totalCount} rows`,
  sure_to_delete_x: ({ keys }: { keys: IDType[] }) =>
    `Are you sure to delete ${keys.join(', ')}?`,
  repository_name: 'Repository Name',
  programming_language: 'Programming Language',
  topic: 'Topic',
  star_count: 'Star Count',

  // Scroll List
  scroll_list: 'Scroll List',
  load_more: 'Load more...',
  no_more: 'No more',

  // Admin
  dashboard: 'Dashboard',
  users: 'Users',
  categories: 'Categories',
  goods: 'Goods',

  userCount: 'User count',
  categoryCount: 'Category count',
  goodsCount: 'Goods count',
  orderCount: 'Order count',
  parcelCount: 'Parcel count',
  commentCount: 'Comment count',

  mobile_phone: 'Mobile phone',
  nick_name: 'Nick name',
  gender: 'Gender',
  avatar: 'Avatar',
  roles: 'Roles',
  administrator: 'Administrator',
  manager: 'Manager',
  client: 'Client',

  name: 'Name',
  parent: 'Parent',

  detail: 'Detail',
  extra_style_name: 'Extra Style Name',
  extra_style_values: 'Extra Style Values',
  multiple_separated_by_spaces: '(multiple separated by spaces)',
  address: 'Address',

  goods_items: 'Goods Items',
  image: 'Image',
  price: 'Price',
  weight: 'Weight',
  code: 'Code',
  styles: 'Styles',
  stock: 'Stock',
} as const;
