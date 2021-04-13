import {genSalt, hash} from 'bcrypt';
import {TenantUserRepository, UsersRepository} from '../../repositories';
import {ErrorHandler} from '../../utils/errorHandler';
import {getTimestamp} from '../../utils/getTimeStamp';

export const userRegister = async (
    userRepository: UsersRepository,
    tenantUserRepository: TenantUserRepository,
    user: any,
) => {
    let userExist: any;

    let shopId = user.shopId
    delete user.shopId

    // Check if user already exist
    try {
        userExist = await userRepository.findOne({
            where: {email: user.email, deletedAt: null},
        });
    } catch (err) {
        return new ErrorHandler(500, err.message || 'Internal Server Error');
    }

    if (userExist) {
        return new ErrorHandler(400, 'User Already Exist')
    }

    // Check already tenant has users
    let checkNoOfUser = await userRepository.findOne({where: {tenantId: user.tenantId}})
    if (checkNoOfUser) {
        user.userType = 'member'
    } else {
        user.userType = 'owner'
    }

    user.createdAt = getTimestamp()
    let password = user.password
    let salt = await genSalt(10)
    user.password = await hash(password, salt)

    let reduce = user.permission.reduce((obj: any, item: any) => ({...obj, [item.permission]: item.value}), {})
    user.permission = reduce

    const data = await userRepository.save(user);

    // Add user Id in Tenant User Table
    await tenantUserRepository.create({tenantId: user.tenantId, userId: data.id, accessType: user.userType, permission: user.permission, shopId, createdAt: user.createdAt})

    return {data: data, status: 'success', message: 'User Added Successfully'}
};
