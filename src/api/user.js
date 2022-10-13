import request from "@/utils/request";

/**
 * 用户登录接口
 * */ 
export function login(data) {
  return request({
    url:'/sys/login',
    method:'post',
    data
  }) 
}

/**
 * 获取用户资料地址
 * */ 
export function getUserInfo(){
  return request({
    url:'/sys/profile',
    method:'post',

  })
}

/**
 * 获取某个用户的基本信息
 * */ 
export function getUserDetailById(id){
  return request({
    url:`/sys/user/${id}`
  })
}

   