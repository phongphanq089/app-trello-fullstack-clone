import UploadAvatar from '@/components/shared/UploadAvatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { updateProfile } from '@/redux/slice/authSlice'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { useUpdatePassword, useUpdateUser } from '@/services/query/auth'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

export function PageAccountSetting() {
  const user = useAppSelector((state) => state.auth.user)

  const [avatar, setAvatar] = useState<null | any>(null)

  const [username, setUserName] = useState(user?.username)

  const [displayName, setDisplayName] = useState(user?.displayName)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const dispatch = useDispatch<AppDispatch>()

  const { mutate: updateUser } = useUpdateUser()

  const { mutate: updatePassword } = useUpdatePassword()

  const handleAccountSubmit = () => {
    const formData = new FormData()

    formData.append('profileImage', avatar)

    const payload = {
      username: username,
      displayName: displayName
    }
    const uploadFormProfileData = avatar ? formData : payload

    updateUser(uploadFormProfileData, {
      onSuccess: (data) => {
        dispatch(updateProfile(data.result))

        toast.success('Updated profile successfull')
      },
      onError: (error) => {
        console.log(`Error creating column, ${error}`)
      }
    })
  }

  const handleChangePassword = () => {
    const payload = {
      current_password: currentPassword,
      new_password: newPassword
    }
    updatePassword(payload, {
      onSuccess: () => {
        // dispatch(logout())
        toast.success('Updated password successfull')
      }
    })
  }

  return (
    <Tabs defaultValue='account' className='w-[400px] mx-auto'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='account'>Account</TabsTrigger>
        <TabsTrigger value='password'>Password</TabsTrigger>
      </TabsList>
      <TabsContent value='account'>
        <Card>
          <CardHeader>
            <UploadAvatar setAvatar={setAvatar} />
            <CardTitle>Account</CardTitle>
            <CardDescription>Make changes to your account here. Click save when you're done.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='space-y-1'>
              <Label htmlFor='current'>Your Email</Label>
              <Input id='current' type='email' value={user?.email} disabled />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='name'>User Name </Label>
              <Input defaultValue={username} onChange={(e) => setUserName(e.target.value)} />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='displayName2'>Display name</Label>
              <Input defaultValue={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAccountSubmit}>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value='password'>
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='space-y-1'>
              <Label htmlFor='current'>Current password</Label>
              <Input type='password' onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='new'>New password</Label>
              <Input type='password' onChange={(e) => setNewPassword(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleChangePassword}>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
