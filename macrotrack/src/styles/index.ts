export const ui = {
  // layout
  pageWrapper:    'flex h-screen bg-gray-500',
  pageCentered:   'flex h-screen bg-gray-500 items-center justify-center',
  mainWrapper:    'flex flex-col flex-1 overflow-hidden',
  content:        'flex-1 overflow-y-auto p-5 flex flex-col gap-4',

  // sidebar
  sidebar:        'w-44 bg-gray-300 border-r border-gray-300 flex flex-col p-3 gap-1',
  sidebarLogo:    'text-base font-medium px-3 py-2 mb-2 border-b border-gray-100',
  navActive:      'flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-sm font-medium text-gray-800',
  navPassive: 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-100 cursor-pointer transition-colors',

  // navbar
  navbar:         'h-14 bg-gray-300 border-b border-gray-300 px-6 flex items-center justify-between',
  navbarDate:     'text-sm font-medium text-gray-800',
  navbarUser:     'flex items-center gap-2',
  avatar:         'w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-xs font-medium flex items-center justify-center',

  // card
  card:           'bg-gray-200 border border-gray-100 rounded-xl p-4',
  cardSm:         'bg-gray-200 border border-gray-100 rounded-xl p-4 w-80 flex flex-col gap-4',
  cardMd:         'bg-gray-200 border border-gray-100 rounded-xl p-4 w-96 flex flex-col gap-4',
  cardTitle:      'text-sm font-medium text-black',

  // form
  input:          'w-full text-sm px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black placeholder-gray-400 outline-none focus:border-gray-400',
  btnPrimary:     'px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors',
  btnOutline:     'py-2 text-sm rounded-lg border bg-gray-50 text-gray-800 border-gray-200 hover:border-gray-400 transition-colors',
  btnOutlineActive: 'py-2 text-sm rounded-lg border bg-blue-500 text-white border-blue-500 transition-colors',
  btnFull:        'w-full justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors',

  // grid
  grid2:          'grid grid-cols-2 gap-3',
  grid3:          'grid grid-cols-3 gap-3',

  // form group
  formGroup:      'flex flex-col gap-1',

  // text
  label:          'text-sm font-medium text-black',
  muted:          'text-xs text-gray-800',
  mutedCenter:    'text-xs text-gray-800 text-center',
  accent:         'text-sm font-medium text-gray-800',
  error:          'text-xs text-red-500',
  logoText:       'text-xl font-medium text-black',

  // list
  pill:           'bg-gray-200 rounded-lg p-3',
  listItem:       'flex justify-between items-center px-3 py-2 bg-gray-50 rounded-lg',
  listItemName:   'text-sm font-medium text-gray-800',


  gramBtn:        'px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-800 hover:border-gray-400 transition-colors',
  gramBtnActive:  'px-3 py-1.5 text-xs rounded-lg border border-blue-500 bg-blue-500 text-white transition-colors',
  searchWrap:     'relative w-full',
  clearBtn:       'absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none',


  logoutBtn: 'text-xs text-gray-400 hover:text-red-400 transition-colors cursor-pointer',
  profileBox: 'mt-auto pt-3 border-t border-gray-200 flex flex-col gap-1',
  profileName: 'text-xs font-medium text-gray-800 px-3',
  profileStat: 'text-xs text-gray-400 px-3',


  modalOverlay: 'fixed inset-0 bg-black/40 flex items-center justify-center z-50',
  modalCard:    'bg-gray-200 border border-gray-100 rounded-xl p-5 w-96 flex flex-col gap-4',

  categoryBtn:       'px-2.5 py-1 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-800 hover:border-gray-400 transition-colors whitespace-nowrap',
  categoryBtnActive: 'px-2.5 py-1 text-xs rounded-lg border border-blue-500 bg-blue-500 text-white transition-colors whitespace-nowrap',


  mealTypeBtn:       'flex-1 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-800 hover:border-gray-400 transition-colors',
  mealTypeBtnActive: 'flex-1 py-1.5 text-xs rounded-lg border border-blue-500 bg-blue-500 text-white transition-colors',
  mealGroup:         'flex flex-col gap-2',
  mealGroupTitle:    'flex items-center justify-between px-1',
  mealGroupName:     'text-xs font-medium text-gray-500 uppercase tracking-wide',
  mealGroupKcal:     'text-xs text-gray-400',


  historyRow:      'flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors',
  historyDate:     'w-24 text-xs font-medium text-gray-800 flex-shrink-0',
  historyBar:      'flex-1 h-2 bg-gray-100 rounded-full overflow-hidden',
  historyBarFill:  'h-full bg-blue-400 rounded-full transition-all duration-300',
  historyKcal:     'w-20 text-xs text-gray-500 text-right flex-shrink-0',
  historyEmpty:    'text-xs text-gray-300 italic',

  detailRow:   'flex justify-between items-center py-2 border-b border-gray-100 last:border-0',
  detailLabel: 'text-xs text-gray-500',
  detailValue: 'text-xs font-medium text-black',

  
} as const