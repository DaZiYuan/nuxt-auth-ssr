import { BaseScheme } from '~auth/runtime'
import { auth } from "~/utils/tcbInstance"

export default class TcbScheme extends BaseScheme {
    async mounted(e) {
        if (process.server) {
            console.log("server mounted")
            //服务端使用虚假用户，客户端检测到此值再重新验证
            let user = {
                role: 'dummyUser'
            };
            console.log("server mounted1")
            this.$auth.setUser(user)
            console.log("server mounted2", this.$auth.user)
        }
        else {
            debugger
            //服务端默认角色，并未登录
            if (this.$auth.user && this.$auth.user.role === "dummyUser") {
                this.$auth.reset();
            }

            let user = await this.fetchUser()
            if (!user) {
                let ctx = this.$auth.ctx;

                //切换上下文
                setTimeout(() => {
                    if (ctx.app.router.history.ready) {
                        ctx.$auth.redirect('login')
                    }
                }, 0);
            }
        }
    }
    async login(endpoint) {
        let { email, password, rememberme, wexin } = endpoint.data;
        console.log("login", endpoint);
        if (wexin) {
            //微信登录什么都不用处理
        }
        else {
            let r = await auth.signInWithEmailAndPassword(email, password)
            console.log("signInWithEmailAndPassword", r);
        }
        await this.fetchUser()
    }
    async fetchUser(e) {
        console.log("fetchUser", e, auth);
        if (auth.currentUser) {
            const user = {
                username: auth.currentUser.nickName || auth.currentUser.email,
                roles: ['user']
            }

            this.$auth.setUser(user);
            return user;
        }
    }
    async logout(e) {
        console.log("logout", e);
        try {
            if (auth) {
                await auth.signOut();
            }
        } catch (error) {
            console.log(error);
        }
        return this.$auth.reset()
    }
    reset() {
        this.$auth.setUser(false)
    }
    check(e) {
        if (process.server) {
            //服务端直接返回true，客户端判断
            return {
                valid: true
            }
        }

        const response = {
            valid: false,
        }

        if (auth.currentUser) {
            response.valid = true;
        }
        return response
    }
}