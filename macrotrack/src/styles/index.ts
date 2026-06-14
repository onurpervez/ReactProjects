export const ui = {
  // layout
  pageWrapper:    'flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-zinc-950',
  pageCentered:   'flex min-h-screen bg-gray-100 dark:bg-zinc-950 items-center justify-center p-4',
  mainWrapper:    'flex flex-col flex-1 overflow-hidden',
  content:        'flex-1 overflow-y-auto p-3 md:p-5 flex flex-col gap-4',

  // sidebar
  sidebar:        'hidden md:flex w-44 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex-col p-3 gap-1 flex-shrink-0',
  sidebarLogo:    'text-base font-medium px-3 py-2 mb-2 border-b border-gray-200 dark:border-zinc-800 text-black dark:text-white',
  navActive:      'flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-sm font-medium text-white',
  navPassive:     'flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors',

  // mobile nav
  mobileNav:         'flex md:hidden items-center justify-around bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 py-2 px-4 flex-shrink-0',
  mobileNavBtn:      'flex flex-col items-center gap-0.5 text-xs text-gray-400 dark:text-zinc-500 py-1 px-3',
  mobileNavBtnActive:'flex flex-col items-center gap-0.5 text-xs text-blue-500 py-1 px-3',

  // navbar
  navbar:         'h-14 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 md:px-6 flex items-center justify-between flex-shrink-0',
  navbarDate:     'text-sm font-medium text-gray-800 dark:text-zinc-200 hidden sm:block',
  navbarUser:     'flex items-center gap-2',
  avatar:         'w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium flex items-center justify-center cursor-pointer flex-shrink-0',

  // card
  card:           'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4',
  cardSm:         'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 w-full max-w-sm flex flex-col gap-4',
  cardMd:         'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 w-full max-w-md flex flex-col gap-4',
  cardTitle:      'text-sm font-medium text-black dark:text-white',

  // modal
  modalOverlay:   'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4',
  modalCard:      'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 w-full max-w-md flex flex-col gap-4',

  // form
  input:          'w-full text-sm px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 outline-none focus:border-blue-400 dark:focus:border-blue-500',
  btnPrimary:     'px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors',
  btnOutline:     'py-2 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 hover:border-gray-400 dark:hover:border-zinc-500 transition-colors',
  btnOutlineActive: 'py-2 text-sm rounded-lg border border-blue-500 bg-blue-500 text-white transition-colors',
  btnFull:        'w-full justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors',

  // grid
  grid2:          'grid grid-cols-2 gap-3',
  grid3:          'grid grid-cols-3 gap-3',

  // form group
  formGroup:      'flex flex-col gap-1',

  // text
  label:          'text-sm font-medium text-black dark:text-white',
  muted:          'text-xs text-gray-500 dark:text-zinc-400',
  mutedCenter:    'text-xs text-gray-500 dark:text-zinc-400 text-center',
  accent:         'text-sm font-medium text-blue-500',
  error:          'text-xs text-red-500',
  logoText:       'text-xl font-medium text-black dark:text-white',
  logoutBtn:      'text-xs text-gray-400 dark:text-zinc-500 hover:text-red-400 transition-colors cursor-pointer',

  // profile
  profileBox:     'mt-auto pt-3 border-t border-gray-200 dark:border-zinc-800 flex flex-col gap-1',
  profileName:    'text-xs font-medium text-gray-800 dark:text-zinc-200 px-3',
  profileStat:    'text-xs text-gray-400 dark:text-zinc-500 px-3',

  // list
  pill:           'bg-gray-50 dark:bg-zinc-800 rounded-lg p-3',
  listItem:       'flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-zinc-800 rounded-lg',
  listItemName:   'text-sm font-medium text-gray-800 dark:text-zinc-200',

  // food search
  searchWrap:     'relative w-full',
  clearBtn:       'absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors text-lg leading-none',
  gramBtn:        'px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 hover:border-gray-400 transition-colors',
  gramBtnActive:  'px-3 py-1.5 text-xs rounded-lg border border-blue-500 bg-blue-500 text-white transition-colors',
  categoryBtn:       'px-2.5 py-1 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 hover:border-gray-400 transition-colors whitespace-nowrap',
  categoryBtnActive: 'px-2.5 py-1 text-xs rounded-lg border border-blue-500 bg-blue-500 text-white transition-colors whitespace-nowrap',

  // meal
  mealTypeBtn:       'flex-1 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 hover:border-gray-400 transition-colors',
  mealTypeBtnActive: 'flex-1 py-1.5 text-xs rounded-lg border border-blue-500 bg-blue-500 text-white transition-colors',
  mealGroup:         'flex flex-col gap-2',
  mealGroupTitle:    'flex items-center justify-between px-1',
  mealGroupName:     'text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide',
  mealGroupKcal:     'text-xs text-gray-400 dark:text-zinc-500',

  // history
  historyRow:     'flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors',
  historyDate:    'w-24 text-xs font-medium text-gray-800 dark:text-zinc-200 flex-shrink-0',
  historyBar:     'flex-1 h-2 bg-gray-100 dark:bg-zinc-700 rounded-full overflow-hidden',
  historyBarFill: 'h-full bg-blue-400 rounded-full transition-all duration-300',
  historyKcal:    'w-20 text-xs text-gray-500 dark:text-zinc-400 text-right flex-shrink-0',
  historyEmpty:   'text-xs text-gray-300 dark:text-zinc-600 italic',

  // detail
  detailRow:      'flex justify-between items-center px-3 py-2 border-b border-gray-100 dark:border-zinc-800 last:border-0',
  detailLabel:    'text-xs text-gray-500 dark:text-zinc-400',
  detailValue:    'text-xs font-medium text-black dark:text-white',
} as const