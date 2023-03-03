import { IDType } from 'mobx-restful';

export default {
  sign_in: '登錄',
  sign_out: '退出',

  welcome_to: '歡迎使用',
  get_started_by_editing: '開始你的專案吧，編輯',
  upstream_projects: '上游專案',
  home_page: '主頁',
  source_code: '源代碼',
  component: '元件',
  pagination: '分頁',
  powered_by: '強力驅動自',
  documentation: '文檔',
  documentation_summary: '查找有關 Next.js 功能和 API 的深入資訊。',
  learn: '學習',
  learn_summary: '在帶有測驗的交互式課程中了解 Next.js！',
  examples: '示例',
  examples_summary: '發現和部署示例 Next.js 專案。',
  deploy: '部署',
  deploy_summary: '使用 Vercel 立即將您的 Next.js 站點部署到公共 URL。',
  create: '新增',
  submit: '提交',
  cancel: '取消',
  edit: '編輯',
  delete: '刪除',
  total_x_rows: ({ totalCount }: { totalCount: number }) =>
    `共 ${totalCount} 行`,
  sure_to_delete_x: ({ keys }: { keys: IDType[] }) =>
    `您確定刪除 ${keys.join('、')} 嗎？`,
  repository_name: '倉庫名',
  programming_language: '編程語言',
  topic: '話題',
  star_count: '星標數',

  // Scroll List
  scroll_list: '滾動列表',
  load_more: '加載更多……',
  no_more: '沒有更多',

  // Admin
  dashboard: '儀錶板',
  users: '用戶',
  categories: '品類',
  goods: '商品',

  userCount: '用戶總數',
  categoryCount: '品類總數',
  goodsCount: '商品總數',
  orderCount: '訂單總數',
  parcelCount: '郵包總數',
  commentCount: '評價總數',

  mobile_phone: '行動電話號',
  nick_name: '暱稱',
  gender: '性別',
  avatar: '頭像',
  roles: '角色',
  administrator: '管理員',
  manager: '經理',
  client: '客戶',

  name: '名稱',
  parent: '上級',

  detail: '詳情',
  extra_style_name: '附加樣式名',
  extra_style_values: '附加樣式值（空格分隔）',
} as const;
