import { prisma } from "@/lib/prisma"
import GroupNav from "./GroupNav"

async function getUniqueGroups() {
  try {
    const results = await prisma.work.findMany({
      where: {
        groupName: {
          not: null
        },
        isHidden: false,
        parentId: null  // Only show groups that have parent images
      },
      select: {
        groupName: true
      },
      distinct: ["groupName"],
      orderBy: {
        groupName: "asc"
      }
    })
    
    return results
      .map(r => r.groupName)
      .filter((g): g is string => g !== null)
  } catch (error) {
    console.error("Error fetching groups:", error)
    return []
  }
}

async function getUniqueYears() {
  try {
    const results = await prisma.work.findMany({
      where: {
        isHidden: false,
        dateCreated: { not: null },
        parentId: null  // Only show years that have parent images
      },
      select: {
        dateCreated: true
      }
    })
    
    // Extract unique years and sort in descending order
    const years = Array.from(
      new Set(
        results
          .map(r => r.dateCreated ? new Date(r.dateCreated).getFullYear() : null)
          .filter((year): year is number => year !== null && !isNaN(year) && year > 1900)
      )
    ).sort((a, b) => b - a) // Sort descending (newest first)
    
    return years
  } catch (error) {
    console.error("Error fetching years:", error)
    return []
  }
}

export default async function GroupNavWrapper() {
  const groups = await getUniqueGroups()
  const years = await getUniqueYears()
  return <GroupNav groups={groups} years={years} />
}

