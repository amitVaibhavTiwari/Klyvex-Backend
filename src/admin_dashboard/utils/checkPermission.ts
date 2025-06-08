import { AppDataSource } from "../../dataSource/dataSource.js";

export const checkActionPermission = async (
  action: string,
  groupId: string | number
): Promise<boolean> => {
  const resp = await AppDataSource.query(
    `SELECT permission 
         FROM admin_permissions 
         WHERE permission = $1 
           AND id IN (
             SELECT permission_id 
             FROM admin_group_permissions 
             WHERE group_id = $2
           )`,
    [action, groupId]
  );

  if (resp.length > 0) {
    if (resp[0].permission == action) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
