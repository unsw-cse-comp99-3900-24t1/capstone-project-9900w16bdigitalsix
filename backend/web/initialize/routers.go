package initialize

import (
	"web/global"
	"web/middlewares"
	"web/routes"

	_ "web/docs" 

	"github.com/gin-gonic/gin"
	"github.com/swaggo/files"                  // swagger embed files
	ginSwagger "github.com/swaggo/gin-swagger" // gin-swagger middleware
)

func InitRouters() *gin.Engine {
	Router := gin.Default()
	// config CORS
	Router.Use(middlewares.CORS())
	//swagger document
	Router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	// static files
	imagesPath := global.ServerConfig.PicturePath
	filePath := global.ServerConfig.FilePath
	Router.Static("/images", imagesPath)
	Router.Static("/files", filePath)

	ApiGroup := Router.Group("v1")
	routes.UserRouter(ApiGroup)
	routes.BaseRouter(ApiGroup)
	routes.GroupRouter(ApiGroup)
	routes.ProjectRouter(ApiGroup)
	routes.AdminRouter(ApiGroup)
	routes.StudentRouter(ApiGroup)
	routes.NotificationRouter(ApiGroup)
	routes.ProgressRouter(ApiGroup)
	routes.SearchRouter(ApiGroup)
	routes.MessageRouter(ApiGroup)
	return Router
}
