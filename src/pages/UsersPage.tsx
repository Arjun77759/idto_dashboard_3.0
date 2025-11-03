import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { Users2, Search, UserPlus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUsers } from '@/hooks/useUsers'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

/**
 * UsersPage - User Management Interface
 * 
 * ⚠️ ADMIN ONLY - This page is restricted to users with Admin role.
 * Backend API endpoints will return 403 Forbidden for non-admin users.
 * 
 * Features:
 * - View all users with filtering (role, status, search)
 * - Create new users
 * - Edit user details (name, email, role, status)
 * - Delete users (soft delete recommended)
 * 
 * @requires Admin role authentication
 */
const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Fetch users with API
  const { data: users, loading, error } = useUsers()

  // Filter users locally
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = roleFilter === 'All' || user.role === roleFilter
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter
      
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchTerm, roleFilter, statusFilter])

  if (loading) {
    return (
      <div className="bg-[#f7f7f8] flex items-center justify-center p-20">
        <div className="animate-pulse text-[#616675]">Loading users...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#f7f7f8] flex items-center justify-center p-20">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f7f7f8] flex flex-col gap-4 sm:gap-5 items-start p-4 sm:p-6 relative rounded-2xl w-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <Users2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#131b31]" />
            <h1 className="font-medium leading-[1.4] text-lg sm:text-[20px] text-[#131b31] tracking-[-0.2px]">
              Users
            </h1>
          </div>
          <p className="text-[12px] text-[#616675] leading-[1.4] tracking-[-0.12px]">
            Manage your users and their permissions • {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button className="bg-gradient-to-r from-[#0019ff] to-[#0019ff] hover:from-[#0015cc] hover:to-[#0015cc] text-white">
          <UserPlus className="size-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-[#e7e8ea] border-solid flex flex-col gap-4 items-start p-6 relative rounded-2xl shrink-0 w-full">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-[#9296a0] z-10" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 border-[#e7e8ea] text-[12px]"
            />
          </div>
          <div className="flex gap-3">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px] border-[#e7e8ea] h-10 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All" className="text-[12px]">All Roles</SelectItem>
                <SelectItem value="Admin" className="text-[12px]">Admin</SelectItem>
                <SelectItem value="Moderator" className="text-[12px]">Moderator</SelectItem>
                <SelectItem value="User" className="text-[12px]">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] border-[#e7e8ea] h-10 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All" className="text-[12px]">All Status</SelectItem>
                <SelectItem value="Active" className="text-[12px]">Active</SelectItem>
                <SelectItem value="Inactive" className="text-[12px]">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white border border-[#e7e8ea] rounded-2xl overflow-hidden w-full"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow
                  key={user.user_id}
                  className="hover:bg-gray-50"
                >
                  <TableCell className="whitespace-nowrap">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      className="flex items-center"
                    >
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0019ff] to-[#0015cc] flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-[13px] font-medium text-[#131b31]">{user.name}</div>
                        <div className="text-[12px] text-[#616675]">{user.email}</div>
                      </div>
                    </motion.div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge 
                      variant={user.role === 'Admin' ? 'destructive' : user.role === 'Moderator' ? 'secondary' : 'default'}
                      className={`text-[11px] ${
                        user.role === 'Admin' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                        user.role === 'Moderator' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                        'bg-blue-100 text-blue-800 hover:bg-blue-100'
                      }`}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge 
                      variant={user.status === 'Active' ? 'default' : 'secondary'}
                      className={`text-[11px] ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-[12px] text-[#616675]">
                    {user.last_login}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-[12px] font-medium">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-[#0019ff] hover:text-[#0015cc]">
                        <Pencil className="size-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:text-red-700">
                        <Trash2 className="size-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default UsersPage
