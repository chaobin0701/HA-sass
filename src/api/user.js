import request from "@/utils/request";

/**
 * 获取用户资料地址
 * */ 
export function getUserInfo(){
  return request({
    url:'/sys/profile',
    method:'post',

  })
}

export function login(data) {}

export function getInfo(token) {}

export function logout() {}
   