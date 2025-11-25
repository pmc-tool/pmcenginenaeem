/**
 * Demo Multi-File Streaming
 * For testing the AI code editor streaming experience
 */

import type { FileChange } from '../types/multiFileStream'

export const demoFileChanges: FileChange[] = [
  {
    filePath: 'src/features/auth/LoginForm.tsx',
    action: 'create',
    language: 'typescript',
    content: `import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import './LoginForm.css'

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login({ email, password })
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-form__title">Welcome Back</h2>

      <div className="login-form__field">
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className="login-form__field">
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
      >
        Sign In
      </Button>

      <a href="/forgot-password" className="login-form__forgot">
        Forgot password?
      </a>
    </form>
  )
}
`,
  },
  {
    filePath: 'src/features/auth/LoginForm.css',
    action: 'create',
    language: 'css',
    content: `.login-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.login-form__title {
  margin: 0 0 1.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
}

.login-form__field {
  margin-bottom: 1.25rem;
}

.login-form__field:last-of-type {
  margin-bottom: 1.5rem;
}

.login-form__forgot {
  display: block;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #EA2724;
  text-align: center;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.login-form__forgot:hover {
  opacity: 0.8;
  text-decoration: underline;
}

@media (max-width: 640px) {
  .login-form {
    padding: 1.5rem;
    max-width: 100%;
  }

  .login-form__title {
    font-size: 1.5rem;
  }
}
`,
  },
  {
    filePath: 'src/hooks/useAuth.ts',
    action: 'create',
    language: 'typescript',
    content: `import { useState, useCallback } from 'react'
import { authService } from '../services/authService'
import type { User, LoginCredentials } from '../types/auth'

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.login(credentials)
      setUser(response.user)
      localStorage.setItem('auth_token', response.token)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)

    try {
      await authService.logout()
      setUser(null)
      localStorage.removeItem('auth_token')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken()
      localStorage.setItem('auth_token', response.token)
    } catch (err) {
      setUser(null)
      localStorage.removeItem('auth_token')
      throw err
    }
  }, [])

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    refreshToken,
  }
}
`,
  },
  {
    filePath: 'src/services/authService.ts',
    action: 'create',
    language: 'typescript',
    content: `import axios from 'axios'
import type { User, LoginCredentials, AuthResponse } from '../types/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class AuthService {
  private baseURL = \`\${API_BASE_URL}/auth\`

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      \`\${this.baseURL}/login\`,
      credentials
    )
    return response.data
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    await axios.post(
      \`\${this.baseURL}/logout\`,
      {},
      {
        headers: {
          Authorization: \`Bearer \${token}\`,
        },
      }
    )
  }

  async refreshToken(): Promise<AuthResponse> {
    const token = localStorage.getItem('auth_token')
    if (!token) throw new Error('No token found')

    const response = await axios.post<AuthResponse>(
      \`\${this.baseURL}/refresh\`,
      {},
      {
        headers: {
          Authorization: \`Bearer \${token}\`,
        },
      }
    )
    return response.data
  }

  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem('auth_token')
    if (!token) throw new Error('No token found')

    const response = await axios.get<User>(\`\${this.baseURL}/me\`, {
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    })
    return response.data
  }
}

export const authService = new AuthService()
`,
  },
  {
    filePath: 'src/types/auth.ts',
    action: 'create',
    language: 'typescript',
    content: `export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  expiresIn: number
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
`,
  },
]
