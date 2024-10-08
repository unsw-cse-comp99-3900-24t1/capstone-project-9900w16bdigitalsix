package routes

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"web/controllers"
	"web/middlewares"
)

func BaseRouter(Router *gin.RouterGroup) {
	UserRouter := Router.Group("base")
	zap.S().Info("captcha url")
	{
		UserRouter.GET("/captcha", controllers.GetCaptcha)
	}
}

func UserRouter(Router *gin.RouterGroup) {
	UserRouter := Router.Group("user")
	zap.S().Info("user related url")
	{

		UserRouter.POST("/register/send_email", controllers.Register)
		UserRouter.GET("/register/verify", controllers.VerifyEmail)
		UserRouter.POST("/pwd_login", controllers.PasswordLogin)
		UserRouter.POST("/change_password", controllers.ChangePassword)
		UserRouter.POST("/forget_password/send_email", controllers.SendEmailResetPassword)
		UserRouter.POST("/reset/password", controllers.ResetPassword)
		UserRouter.POST("/modify/profile", controllers.UpdateUserInfo)
		UserRouter.GET("/profile/:user_id", controllers.GetPersonProfile)
		UserRouter.GET("/student/list", controllers.GetAllStudents)
		UserRouter.GET("/get/user/list", controllers.GetAllUsersInfo)
		UserRouter.GET("/same/course/student/list/:userId", controllers.GetAllSameCourseStudents)
	}
}

func AdminRouter(Router *gin.RouterGroup) {
	AdminRouter := Router.Group("admin")
	AdminRouter.Use(middlewares.JWTAuth(), middlewares.IsAdmin())
	{
		AdminRouter.GET("/get/tutor/list", controllers.GetAllTutorInfo)
		AdminRouter.GET("/get/coordinator/list", controllers.GetAllCoordinatorInfo)
		AdminRouter.POST("/modify/user/role", controllers.ModifyUserRole)
		AdminRouter.POST("/change/project/coordinator", controllers.ChangeProjectCoordinator)
		AdminRouter.POST("/change/project/tutor", controllers.ChangeProjectTutor)
		AdminRouter.GET("/get/tutor/:projectId", controllers.GetTutorInfoByProjectID)
		AdminRouter.GET("/get/coordinator/:projectId", controllers.GetCoorInfoByProjectID)
	}
}

func StudentRouter(Router *gin.RouterGroup) {
	studentRouter := Router.Group("student")
	{
		studentRouter.GET("/unassigned/list", controllers.GetAllUnassignedStudents)
		studentRouter.GET("/unassigned/list/:course", controllers.GetAllUnassignedStudentsByCourse)
	}
}

func GroupRouter(Router *gin.RouterGroup) {
	groupRouter := Router.Group("team")
	zap.S().Info("group related url")
	{
		groupRouter.POST("/create", controllers.CreateTeam)
		groupRouter.PUT("/update/profile/:teamId", controllers.UpdateTeamProfile)
		groupRouter.PUT("/join", controllers.JoinTeam)
		groupRouter.GET("/profile/:userId", controllers.GetTeamProfile)
		groupRouter.DELETE("/leave/:userId", controllers.LeaveTeam)
		groupRouter.GET("/get/student-info/:teamName", controllers.GetStudentInfo)
		groupRouter.GET("/get/list", controllers.GetAllTeams)
		groupRouter.GET("/get/list/:course", controllers.GetAllTeamsByCourse)
		groupRouter.GET("/get/unallocated/list", controllers.GetUnallocatedTeams)
		groupRouter.GET("/get/unallocated/list/:course", controllers.GetUnallocatedTeamsByCourse)
		groupRouter.GET("/invite/:userId/:teamId", controllers.InviteUserToTeam)
		groupRouter.PUT("/preference/project/:userId", controllers.UpdateTeamPreferences)
		groupRouter.GET("/get/preferences/:userId", controllers.GetTeamPreferences)
		groupRouter.PUT("/project/allocation", controllers.ProjectAllocation)
		groupRouter.PUT("/project/reject", controllers.RejectProjectAllocation)

	}
}

func ProjectRouter(Router *gin.RouterGroup) {
	projectRouter := Router.Group("project")
	zap.S().Info("project related url")
	{
		projectRouter.POST("/create", controllers.CreateProject)
		projectRouter.GET("/get/public_project/list", controllers.GetProjectList)
		projectRouter.GET("/detail/:projectId", controllers.GetProjectDetail)
		projectRouter.DELETE("/delete/:projectId", controllers.DeleteProject)
		projectRouter.POST("/modify/:projectId", controllers.ModifyProjectDetail)
		projectRouter.GET("/team/allocated/:projectId", controllers.GetAllocatedTeamDetail)
		projectRouter.GET("/preferencedBy/team/:projectId", controllers.GetPreferencedByTeamsDetail)
		projectRouter.GET("/:projectId/preferencedBy/:teamId/detail", controllers.GetProjectPreferencedByTeamDetail)
		projectRouter.GET("/get/list/byRole/:userId", controllers.GetProjectsByRole)
		projectRouter.GET("/get/archived/list", controllers.GetArchivedProjects)
		projectRouter.GET("/archive/:projectId", controllers.ArchiveProject)
		projectRouter.GET("statistics/", controllers.GetStatistics)
	}
}

func NotificationRouter(Router *gin.RouterGroup) {
	notificationRouter := Router.Group("notification")
	{
		notificationRouter.GET("/get/all/:userId", controllers.GetUserNotifications)
		notificationRouter.DELETE("/clear/all/:userId", controllers.ClearUserNotifications)
	}
}

func ProgressRouter(Router *gin.RouterGroup) {
	progressRouter := Router.Group("progress")
	{
		progressRouter.POST("/create/userstory", controllers.CreateUserStory)
		progressRouter.POST("/edit/:userStoryId", controllers.EditUserStory)
		progressRouter.DELETE("/delete/:userStoryId", controllers.DeleteUserStory)
		progressRouter.POST("/edit/sprint/date", controllers.EditSprintDate)
		progressRouter.POST("/edit/grade", controllers.EditGrade)
		progressRouter.GET("/get/grade/:teamId", controllers.GetGrades)
		progressRouter.GET("/get/detail/:teamId", controllers.GetProgressDetail)
	}
}

func SearchRouter(Router *gin.RouterGroup) {
	searchRouter := Router.Group("search")
	{
		searchRouter.POST("/team/unallocated/preferenceProject/list/detail", controllers.SearchUnallocatedTeamsProject)
		searchRouter.POST("/team/unallocated/list/detail", controllers.SearchUnallocatedTeams)
		searchRouter.GET("/public/project/:filterString", controllers.SearchPublicProjects)

	}
}

func MessageRouter(Router *gin.RouterGroup) {
	messageRouter := Router.Group("message")
	{
		messageRouter.POST("create/channel", controllers.CreateChannel)
		messageRouter.POST("update/channelName", controllers.UpdateChannelName)
		messageRouter.POST("invite/to/channel", controllers.InviteToChannel)
		messageRouter.DELETE("leave/channel/:channelId/:userId", controllers.LeaveChannel)
		messageRouter.GET(":channelId/users/detail", controllers.GetChannelUsersDetail)
		messageRouter.POST("send", controllers.SendMessage)
		messageRouter.GET("channel/:channelId/messages", controllers.GetChannelMessages)
		messageRouter.GET("/get/all/channels/:userId", controllers.GetAllChannels)

	}
}
