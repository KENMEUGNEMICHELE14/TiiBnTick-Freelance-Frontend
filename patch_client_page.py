import sys
import re

with open('frontend2/app/client/page.tsx', 'r') as f:
    f2 = f.read()

with open('app/client/page.tsx', 'r') as f:
    root = f.read()

# 1. Imports
imports = """
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import dynamic from 'next/dynamic'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const MapLeaflet = dynamic(() => import('@/components/MapLeaflet'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-100 animate-pulse rounded-xl" />
});
import { withAuth } from '@/components/hoc/withAuth'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useCallback } from 'react'
import {
  getAnnouncementByClientId,
  deleteAnnouncement,
  publishAnnouncement,
  updateAnnouncement,
  getSubscriptions,
  assignDeliveryPerson,
  AnnouncementResponseDTO,
  SubscriptionResponseDTO
} from '@/services/announcementService'
import { toast } from 'sonner'
import { Loader2, DollarSign, MapIcon, Plus } from 'lucide-react'
import { getRoute } from '@/services/routing'
"""
root = root.replace("import { useState } from 'react'", "import { useState } from 'react'\n" + imports)

# 2. Logic (States + useEffects)
start_logic = "const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)"
end_logic = "toast.error('Erreur lors de la mise à jour de l\\'annonce');\n    }\n  };\n"
start_idx = f2.find(start_logic)
end_idx = f2.find(end_logic) + len(end_logic)

if start_idx == -1 or end_idx == -1 + len(end_logic):
    print("Logic not found!")
    sys.exit(1)

extracted_logic = f2[start_idx:end_idx]

root = root.replace(
    "const [activeTab, setActiveTab] = useState('accueil')", 
    "const [activeTab, setActiveTab] = useState('accueil')\n  const { user, logout } = useAuth()\n  " + extracted_logic
)

# 3. Main content
main_start = '<main className="flex-1">'
main_end = '</main>'

f2_main_idx = f2.find(main_start)
f2_main_end_idx = f2.find(main_end, f2_main_idx)
if f2_main_idx == -1 or f2_main_end_idx == -1:
    print("Main not found in f2!")
    sys.exit(1)
f2_main = f2[f2_main_idx + len(main_start):f2_main_end_idx]

root_main_idx = root.find(main_start)
root_main_end_idx = root.find(main_end, root_main_idx)
if root_main_idx == -1 or root_main_end_idx == -1:
    print("Main not found in root!")
    sys.exit(1)

root = root[:root_main_idx + len(main_start)] + f2_main + root[root_main_end_idx:]

with open('app/client/page.tsx', 'w') as f:
    f.write(root)

print("Patch applied successfully.")
