
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUser } from '@clerk/clerk-react';
import { useClerkSupabaseClient } from '../../integrations/supabase/client';
import type { Experience } from "@/types/database"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { format, parseISO } from "date-fns"
import { Pencil, Trash2, Plus, Briefcase, MapPin, X } from "lucide-react"
import { motion } from "framer-motion"

export default function ExperiencePage() {
  const supabase = useClerkSupabaseClient();
  const { user } = useUser();
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    start_date: "",
    end_date: "",
    current_job: false,
    description: "",
  });

  useEffect(() => {
    fetchExperience();
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [user, supabase]);

  async function fetchExperience() {
    if (!user || !supabase) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .eq("user_id", user.id)
        .order("end_date", { ascending: false });
      if (error) throw error;
      setExperienceList(data as Experience[]);
    } catch (error: any) {
      toast.error(error.message || "Error fetching experience data");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenDialog = (experience: Experience | null = null) => {
    // Close any existing inline forms first
    setShowInlineForm(false)
    setEditingExperience(null)
    
    // Then set up the new form
    if (experience) {
      setEditingExperience(experience)
      setFormData({
        company: experience.company,
        position: experience.position,
        location: experience.location || "",
        start_date: experience.start_date || "",
        end_date: experience.end_date || "",
        current_job: experience.current_job || false,
        description: experience.description || "",
      })
    } else {
      setEditingExperience(null)
      setFormData({
        company: "",
        position: "",
        location: "",
        start_date: "",
        end_date: "",
        current_job: false,
        description: "",
      })
    }
    
    if (isMobile) {
      setShowInlineForm(true);
    } else {
      setDialogOpen(true);
    }
  }

  const handleCloseForm = () => {
    setDialogOpen(false);
    setShowInlineForm(false);
    setEditingExperience(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      current_job: checked,
      end_date: checked ? "" : prev.end_date,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !supabase) return

    try {
      const experienceData = {
        ...formData,
        user_id: user.id,
      }

      if (editingExperience) {
        const { error } = await supabase.from("experience").update(experienceData).eq("id", editingExperience.id)

        if (error) throw error
        toast.success("Experience updated successfully")
      } else {
        const { error } = await supabase.from("experience").insert([experienceData])

        if (error) throw error
        toast.success("Experience added successfully")
      }

      handleCloseForm()
      fetchExperience()
    } catch (error: any) {
      toast.error(error.message || "Error saving experience details")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return

    try {
      if (!supabase) return;
      const { error } = await supabase.from("experience").delete().eq("id", id)

      if (error) throw error
      toast.success("Experience entry deleted successfully")
      fetchExperience()
    } catch (error: any) {
      toast.error(error.message || "Error deleting experience entry")
    }
  }

  function formatDateRange(startDate?: string | null, endDate?: string | null, currentJob?: boolean | null) {
    if (!startDate) return ""

    const start = startDate ? format(parseISO(startDate), "MMM yyyy") : ""
    const end = currentJob ? "Present" : endDate ? format(parseISO(endDate), "MMM yyyy") : ""

    return `${start} - ${end}`
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">
            {editingExperience ? "Edit Experience" : "Add Experience"}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCloseForm}
            className="h-8 w-8 rounded-full"
          >
            <X size={14} />
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="company" className="text-xs">
          Company *
        </Label>
        <Input
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company Name"
          required
          className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position" className="text-xs">
          Position *
        </Label>
        <Input
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Job Title"
          required
          className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-xs">
          Location
        </Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="City, Country"
          className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date" className="text-xs">
            Start Date
          </Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date" className="text-xs">
            End Date
          </Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            disabled={formData.current_job}
            className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="current_job" checked={formData.current_job} onCheckedChange={handleSwitchChange} />
        <Label htmlFor="current_job" className="text-xs">
          I currently work here
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-xs">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your responsibilities and achievements"
          rows={3}
          className="rounded-md border-gray-200 text-sm focus:border-black focus:ring-black"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCloseForm}
          className="h-8 rounded-full border-gray-200 px-3 text-xs touch-manipulation"
        >
          Cancel
        </Button>
        <Button type="submit" className="h-8 rounded-full px-3 text-xs touch-manipulation">
          {editingExperience ? "Update" : "Add"} Experience
        </Button>
      </div>
    </form>
  );

  // Show loading spinner if supabase client is not ready
  if (!supabase) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-b-2 border-black border-t-transparent"></div>
          <p className="mt-3 text-xs text-gray-500">Loading experience data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-16 md:mt-0 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Work Experience</h1>
        <Button
          variant="outline"
          onClick={() => handleOpenDialog()}
          className="h-7 rounded-full border-gray-200 px-3 text-xs hover:bg-gray-50 hover:text-black touch-manipulation"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Experience
        </Button>
      </div>

      {isMobile && showInlineForm && !editingExperience && (
        <Card className="border-gray-200 shadow-none">
          <CardContent className="p-4">
            {renderForm()}
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {experienceList.length === 0 ? (
          <motion.div
            className="rounded-lg border border-gray-200 bg-gray-50 py-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Briefcase size={20} className="text-gray-400" />
            </div>
            <h3 className="text-sm font-medium">No work experience yet</h3>
            <p className="mt-1 text-xs text-gray-500">Add your work experience to showcase your professional journey</p>
            <Button className="mt-3 h-7 rounded-full px-3 text-xs touch-manipulation" variant="outline" onClick={() => handleOpenDialog()}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Experience
            </Button>
          </motion.div>
        ) : (
          experienceList.map((experience, index) => {
            const isBeingEdited = isMobile && editingExperience?.id === experience.id && showInlineForm;
            
            if (isBeingEdited) {
              return (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="border-gray-200 shadow-none">
                    <CardContent className="p-4">
                      {renderForm()}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            }
            
            return (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border-gray-200 shadow-none transition-shadow duration-200 hover:shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-start justify-between text-sm font-medium">
                      <div>
                        <div>{experience.position}</div>
                        <div className="mt-1 text-xs font-normal text-gray-500">
                          {formatDateRange(experience.start_date, experience.end_date, experience.current_job)}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="text-xs font-medium">{experience.company}</div>
                    {experience.location && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} />
                        <span>{experience.location}</span>
                      </div>
                    )}
                    {experience.description && (
                      <p className="mt-2 whitespace-pre-line text-xs text-gray-600">{experience.description}</p>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-end border-t border-gray-100 p-3">
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleOpenDialog(experience)}
                        className="h-8 w-8 rounded-full touch-manipulation"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(experience.id)}
                        className="h-8 w-8 rounded-full touch-manipulation"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-5">
          <DialogHeader>
            <DialogTitle className="text-sm font-medium">
              {editingExperience ? "Edit Experience" : "Add Experience"}
            </DialogTitle>
          </DialogHeader>
          {renderForm()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
