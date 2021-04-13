import {compare} from 'bcrypt';
import {UsersRepository} from '../../repositories';
import {StoreRepository} from '../../repositories/store.repository';
import {ErrorHandler} from '../../utils/errorHandler';
import {getTimestamp} from '../../utils/getTimeStamp';

export const userLogin = async (
  userRepository: UsersRepository,
  storeRepository: StoreRepository,
  user: any,
) => {
  let userExist: any;

  // Check if user already exist
  try {
    userExist = await userRepository.findOne({
      where: {email: user.email, deletedAt: null},
    });
  } catch (err) {
    return new ErrorHandler(500, err.message || 'Internal Server Error');
  }

  if (!userExist) {
    return new ErrorHandler(401, 'User Not Found')
  }

  // verify password match
  let isPasswordMatch = await compare(user.password, userExist.password)
  if (!isPasswordMatch) {
    return new ErrorHandler(401, "Password Incorrect")
  }

  // Make entry on store
  let makeStoreEntry = await storeRepository.create({tenantId: userExist.tenantId, loggedInAt: getTimestamp()})

  delete userExist.password

  return {
    user: userExist,
    tenantId: userExist.tenantId,
    token: '',
    status: "success",
    message: 'Loged in successfully'
  }
};
