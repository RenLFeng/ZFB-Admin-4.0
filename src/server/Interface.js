export const createNewRole = 'permissionManager/addRole'
export const editRolePermisson = 'permissionManager/roleEdit'
// 新建管理员
export const addNewAdmin = ''
export const getRoleList = 'permissionManager/roles'
export const getAdminList = 'permissionManager/users'
export const createNewAdminUser = 'permissionManager/addUser'
export const resetPassword = 'permissionManager/resetPassword'
export const editAdminUser = 'permissionManager/userEdit'
export const delAdminUser = 'permissionManager/delUserInfo'
export const FreezeUser = 'permissionManager/disableUser'
export const ThawUser = 'permissionManager/enableUser'
export const saveFee =
  process.env.NODE_ENV === 'production' ? '/systemFee/saveFee' : '/api/systemFee/saveFee'
export const uploadAPKapi = `${process.env.VUE_APP_UPLOAD_HOST}/package/upload/apk`
export const addNewRelease = `${process.env.VUE_APP_HOST}/sysTemVersion/add`
export const editorRelease = `${process.env.VUE_APP_HOST}/sysTemVersion/edit`
