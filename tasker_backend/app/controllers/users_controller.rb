class UsersController < ApplicationController
    def index
        @users = User.all
        render :json => @users
    end

    def show
        @user = User.find(params[:id])
        render :json => @user
    end

    def new
        @user = User.new
    end

    def create
        @user = User.new(user_params)
        @user.save
        render :json => @user
    end

    def destroy
        @user = User.find(params[:id])
        if (@user.destroy)
            render :json => @user
        else 
            render :json => {success: "fail"}
        end
    end 

    def user_params
        params.require(:user).permit(:id, :name, :user => {})
    end
end
