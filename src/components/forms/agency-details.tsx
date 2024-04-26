'use client'

import { Agency } from '@prisma/client'
import React, { useState } from 'react'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { AlertDialog } from '../ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form } from '../ui/form'
import * as z from 'zod'
import { useForm } from 'react-hook-form'

type Props = {
    data?:Partial<Agency>
}

const FormSchema = z.object({
    
})

const AfencyDetails = ({data}: Props) => {
    const { toast } = useToast()
    const router = useRouter()
    const [deletingAgency, setDeletingAgeny] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>()
    return <AlertDialog>
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Agency Information</CardTitle>
                <CardDescription>
                    Lets create an agency for your business. You can edit agency settings
                    later from the agecy settings tab
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form>

                </Form>
            </CardContent>
        </Card>
    </AlertDialog>
  
}

export default AfencyDetails