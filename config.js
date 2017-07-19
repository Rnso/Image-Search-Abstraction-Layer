const env = process.env

export const CSE_ID= '004101686134906633925:jik6u02anhu'
export const CSE_API_KEY = 'AIzaSyCq-p4FOSPnMIBv0QsboCYtoeAv7e5t2Qs'

export const nodeEnv = env.NODE_ENV || 'development'

export default{
    mongodbUri: 'mongodb://localhost:27017/test',
    port: env.PORT || 8080,
    host: env.HOST || '0.0.0.0',
    get serverUrl(){
        return `http://${this.host}:${this.port}`
    }    
}